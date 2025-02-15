import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import "react-toastify/dist/ReactToastify.css";

const courseSchema = z.object({
  courseName: z.string().min(3, "Course name is required"),
  description: z.string().min(5, "Description is required"),
  courseFee: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid fee format"),
});

type Course = z.infer<typeof courseSchema> & { courseId?: number };

const CoursePage: React.FC = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<Course>({
    resolver: zodResolver(courseSchema),
  });

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses", error);
      toast({
        title: "Error Fetching Courses",
        description: "An error occurred while fetching courses",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onSubmit = async (data: Course) => {
    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse.courseId}`, data);
        toast({
          title: "Course Updated",
          description: "Course has been updated successfully",
        });
      } else {
        await axios.post("/api/courses", data);
        toast({
          title: "Course Created",
          description: "New course has been added successfully",
        });
      }
      reset();
      setEditingCourse(null);
      fetchCourses();
    } catch (error: any) {
      console.error("Error saving course", error);
      toast({
        title: "Error Saving Course",
        description:
          error.response?.data?.details?.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await axios.delete(`/api/courses/${id}`);
      toast({
        title: "Course Deleted",
        description: "Course has been deleted successfully",
      });
      fetchCourses();
    } catch (error: any) {
      console.error("Error deleting course", error);
      toast({
        title: "Error Deleting Course",
        description:
          error.response?.data?.details?.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Course Management</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 p-4 border rounded bg-gray-100"
      >
        <input
          type="text"
          {...register("courseName")}
          placeholder="Course Name"
          className="block w-full p-2 mb-2 border"
        />
        {errors.courseName && (
          <p className="text-red-500">{errors.courseName.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="Description"
          className="block w-full p-2 mb-2 border"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <input
          type="text"
          {...register("courseFee")}
          placeholder="Course Fee"
          className="block w-full p-2 mb-2 border"
        />
        {errors.courseFee && (
          <p className="text-red-500">{errors.courseFee.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : editingCourse
            ? "Update Course"
            : "Add Course"}
        </button>
        {editingCourse && (
          <button
            type="button"
            onClick={() => {
              reset();
              setEditingCourse(null);
            }}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="text-xl font-bold mb-2">Courses List</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Course Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Fee</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.courseId} className="text-center">
              <td className="border p-2">{course.courseName}</td>
              <td className="border p-2">{course.description}</td>
              <td className="border p-2">{course.courseFee}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white p-1 mr-2 rounded"
                  onClick={() => {
                    setEditingCourse(course);
                    reset(course);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded"
                  onClick={() => deleteCourse(course.courseId!)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoursePage;
