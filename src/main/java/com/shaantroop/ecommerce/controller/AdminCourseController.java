package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.CourseRequestDTO;
import com.shaantroop.ecommerce.model.Course;
import com.shaantroop.ecommerce.repository.CourseRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/courses")
public class AdminCourseController {

    private final CourseRepository courseRepository;

    public AdminCourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseRequestDTO dto) {
        Course course = Course.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .instructor(dto.getInstructor())
                .duration(dto.getDuration())
                .build();
        
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequestDTO dto) {
        return courseRepository.findById(id)
                .map(existingCourse -> {
                    existingCourse.setTitle(dto.getTitle());
                    existingCourse.setDescription(dto.getDescription());
                    existingCourse.setPrice(dto.getPrice());
                    existingCourse.setInstructor(dto.getInstructor());
                    existingCourse.setDuration(dto.getDuration());
                    Course updatedCourse = courseRepository.save(existingCourse);
                    return ResponseEntity.ok(updatedCourse);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
