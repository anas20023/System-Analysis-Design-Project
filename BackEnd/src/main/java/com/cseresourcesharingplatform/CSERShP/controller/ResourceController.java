package com.cseresourcesharingplatform.CSERShP.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cseresourcesharingplatform.CSERShP.Services.ResourceService;
import com.cseresourcesharingplatform.CSERShP.model.Resource;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // ✅ Get all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // ✅ Get resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Upload new resource
    @PostMapping
    public ResponseEntity<Resource> uploadResource(@RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.uploadResource(resource));
    }

    // ✅ Approve a resource
    @PutMapping("/{id}/approve")
    public ResponseEntity<Resource> approveResource(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.approveResource(id));
    }

    // ✅ Delete a resource
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
