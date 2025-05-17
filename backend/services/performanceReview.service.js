  import performanceReviewModel from "../models/performanceReviewModel.js"
  import employeeModel from "../models/employeeModel.js"

  class PerformanceReviewService {
    async createPerformanceReview(performanceReviewData) {
      // Generate a ReviewID if not provided
      if (!performanceReviewData.ReviewID) {
        performanceReviewData.ReviewID = `REV-${Date.now()}`
      }

      const newPerformanceReview = new performanceReviewModel(performanceReviewData)
      const performanceReview = await newPerformanceReview.save()
      return performanceReview
    }

    async getPerformanceReviews() {
      return await performanceReviewModel.find({})
    }

    async getPerformanceReviewById(id) {
      const performanceReview = await performanceReviewModel.findById(id)
      if (!performanceReview) throw new Error("Performance review not found!")
      return performanceReview
    }

    async getPerformanceReviewsByEmployeeId(employeeId) {
      // If employeeId is "all", return all records
      if (employeeId === "all") {
        return await performanceReviewModel.find({})
      }

      const performanceReviews = await performanceReviewModel.find({ EmployeeID: employeeId })
      return performanceReviews
    }

    async getPerformanceReviewsByPeriod(startDate, endDate) {
      const performanceReviews = await performanceReviewModel.find({
        ReviewPeriodStart: { $gte: startDate },
        ReviewPeriodEnd: { $lte: endDate },
      })
      return performanceReviews
    }

    async updatePerformanceReview(id, performanceReviewData) {
      // Handle nested structure if present
      if (performanceReviewData?.performanceReviewData && performanceReviewData?.id) {
        id = performanceReviewData.id
        performanceReviewData = performanceReviewData.performanceReviewData
      }

      // Remove fields that shouldn't be updated
      const updateData = { ...performanceReviewData }
      delete updateData._id
      delete updateData.__v

      try {
        const performanceReview = await performanceReviewModel.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )

        if (!performanceReview) throw new Error("Performance review not found")
        return performanceReview
      } catch (error) {
        // Provide specific error messages based on error type
        if (error.name === "CastError") throw new Error("Invalid performance review ID format")
        if (error.name === "ValidationError") throw new Error(`Validation error: ${error.message}`)
        throw error
      }
    }

    async deletePerformanceReview(id) {
      const result = await performanceReviewModel.findByIdAndDelete(id)
      if (!result) throw new Error("Performance review not found!")
      return { message: "Performance review deleted successfully" }
    }

    async getPerformanceReviewStats() {
      const totalReviews = await performanceReviewModel.countDocuments()

      // Get average rating
      const reviews = await performanceReviewModel.find({})
      let totalRating = 0
      let reviewsWithRating = 0

      reviews.forEach((review) => {
        const rating = Number.parseFloat(review.OverallRating)
        if (!isNaN(rating)) {
          totalRating += rating
          reviewsWithRating++
        }
      })

      const averageRating = reviewsWithRating > 0 ? (totalRating / reviewsWithRating).toFixed(2) : "0"

      // Get rating distribution
      const ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      }

      reviews.forEach((review) => {
        const rating = Math.round(Number.parseFloat(review.OverallRating))
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating.toString()]++
        }
      })

      return {
        totalReviews,
        averageRating,
        ratingDistribution,
      }
    }

    async getEmployeeReviewSummary(employeeId) {
      const reviews = await performanceReviewModel.find({ EmployeeID: employeeId })

      if (reviews.length === 0) {
        return {
          employeeId,
          totalReviews: 0,
          averageRating: "0",
          latestReview: null,
          ratingTrend: [],
        }
      }

      // Calculate average rating
      let totalRating = 0
      let reviewsWithRating = 0

      reviews.forEach((review) => {
        const rating = Number.parseFloat(review.OverallRating)
        if (!isNaN(rating)) {
          totalRating += rating
          reviewsWithRating++
        }
      })

      const averageRating = reviewsWithRating > 0 ? (totalRating / reviewsWithRating).toFixed(2) : "0"

      // Get latest review
      const sortedReviews = [...reviews].sort((a, b) => {
        const dateA = new Date(a.ReviewPeriodEnd)
        const dateB = new Date(b.ReviewPeriodEnd)
        return dateB - dateA
      })

      const latestReview = sortedReviews[0]

      // Get rating trend (last 5 reviews)
      const ratingTrend = sortedReviews.slice(0, 5).map((review) => ({
        period: `${review.ReviewPeriodStart} - ${review.ReviewPeriodEnd}`,
        rating: Number.parseFloat(review.OverallRating) || 0,
      }))

      return {
        employeeId,
        totalReviews: reviews.length,
        averageRating,
        latestReview,
        ratingTrend,
      }
    }

    async getDepartmentReviewSummary() {
      // Get all employees
      const employees = await employeeModel.find({})

      // Group employees by department
      const departmentMap = {}

      for (const employee of employees) {
        const departmentId = employee.DepartmentId

        if (!departmentMap[departmentId]) {
          departmentMap[departmentId] = {
            departmentId,
            employees: [],
            totalReviews: 0,
            totalRating: 0,
            reviewsWithRating: 0,
          }
        }

        departmentMap[departmentId].employees.push(employee._id)

        // Get reviews for this employee
        const reviews = await performanceReviewModel.find({ EmployeeID: employee._id.toString() })

        departmentMap[departmentId].totalReviews += reviews.length

        // Add ratings
        reviews.forEach((review) => {
          const rating = Number.parseFloat(review.OverallRating)
          if (!isNaN(rating)) {
            departmentMap[departmentId].totalRating += rating
            departmentMap[departmentId].reviewsWithRating++
          }
        })
      }

      // Calculate average ratings for each department
      const departmentSummaries = Object.values(departmentMap).map((dept) => ({
        departmentId: dept.departmentId,
        employeeCount: dept.employees.length,
        totalReviews: dept.totalReviews,
        averageRating: dept.reviewsWithRating > 0 ? (dept.totalRating / dept.reviewsWithRating).toFixed(2) : "0",
      }))

      return departmentSummaries
    }
  }

  export default new PerformanceReviewService() // Export an instance
