package com.cseresourcesharingplatform.CSERShP.Services;

import org.springframework.stereotype.Service;

import com.cseresourcesharingplatform.CSERShP.Repository.ResourceRepository;
import com.cseresourcesharingplatform.CSERShP.model.Resource;
import com.cseresourcesharingplatform.CSERShP.model.ResourceStatus;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public List<Resource> getResourcesByUploader(Long uploaderId) {
        return resourceRepository.findByUploaderId(uploaderId);
    }

    public List<Resource> getPendingResources() {
        return resourceRepository.findByStatus(ResourceStatus.PENDING);
    }

    public Resource uploadResource(Resource resource) {
        resource.setStatus(ResourceStatus.PENDING);
        return resourceRepository.save(resource);
    }

    public Resource approveResource(Long id) {
        return resourceRepository.findById(id)
                .map(r -> {
                    r.setStatus(ResourceStatus.APPROVED);
                    r.setApprovedAt(new java.util.Date());
                    return resourceRepository.save(r);
                })
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}