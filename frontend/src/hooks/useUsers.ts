import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/api/user.api'
import { User } from '@/types'


export const useUsers = () => {
  const queryClient = useQueryClient()

  // Get all users
  const getUsersQuery = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  })

  // Create user
  const createUserMutation = useMutation({
    mutationFn: (userData: User) => userApi.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: User }) => userApi.updateUser(id, userData),
    onSuccess: (data, variables) => {

      console.log(data)
      // Update the user in the cache
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] })
    },
  })

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })


  return {
    getUsersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  }
}