import prisma from '../config/database.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const getAllProjects = async (req, res) => {
  try {
    const { city, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    if (pageNum < 1 || limitNum < 1) {
      return sendError(res, 'Page and limit must be positive integers', 400);
    }

    const where = {};
    if (city) where.city = city;
    if (status) where.status = status;

    const projects = await prisma.project.findMany({
      where,
      include: {
        developer: {
          select: { id: true, name: true, email: true, phone: true, profileImage: true }
        },
        properties: {
          select: { id: true, title: true, price: true }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.project.count({ where });

    return sendSuccess(res, 'Projects retrieved successfully', {
      projects,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return sendError(res, 'Failed to get projects', 500, error);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        developer: {
          select: { id: true, name: true, email: true, phone: true, profileImage: true }
        },
        properties: {
          select: { id: true, title: true, price: true, city: true }
        }
      }
    });

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, 'Project retrieved successfully', project);
  } catch (error) {
    console.error('Get project error:', error);
    return sendError(res, 'Failed to get project', 500, error);
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      type,
      status,
      address,
      city,
      state,
      totalUnits,
      availableUnits,
      minPrice,
      maxPrice,
      currency,
      amenities,
      plotArea,
      buildupArea,
      floors,
      launchDate,
      completionDate,
      images,
    } = req.body;

    // Validation
    if (!name || !type || !city || !state) {
      return sendError(res, 'Required fields: name, type, city, state', 400);
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        image,
        type,
        status,
        address,
        city,
        state,
        totalUnits: totalUnits ? parseInt(totalUnits) : null,
        availableUnits: availableUnits ? parseInt(availableUnits) : null,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        currency: currency || 'INR',
        amenities: amenities || [],
        plotArea,
        buildupArea,
        floors: floors ? parseInt(floors) : null,
        launchDate: launchDate ? new Date(launchDate) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        images: images || [],
        developerId: req.user.id,
      },
      include: {
        developer: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    return sendSuccess(res, 'Project created successfully', project, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return sendError(res, 'Failed to create project', 500, error);
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        developer: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, 'Project updated successfully', project);
  } catch (error) {
    console.error('Update project error:', error);
    return sendError(res, 'Failed to update project', 500, error);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.delete({
      where: { id: req.params.id }
    });

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, 'Project deleted successfully', { id: project.id });
  } catch (error) {
    console.error('Delete project error:', error);
    return sendError(res, 'Failed to delete project', 500, error);
  }
};
