import prisma from '../config/database.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const getAllProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    if (pageNum < 1 || limitNum < 1) {
      return sendError(res, 'Page and limit must be positive integers', 400);
    }

    const where = {};
    if (city) where.city = city;
    if (type) where.type = type;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true }
        },
        project: {
          select: { id: true, name: true }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.property.count({ where });

    return sendSuccess(res, 'Properties retrieved successfully', {
      properties,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    return sendError(res, 'Failed to get properties', 500, error);
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true, profileImage: true }
        },
        project: {
          select: { id: true, name: true, city: true }
        }
      }
    });

    if (!property) {
      return sendError(res, 'Property not found', 404);
    }

    // Increment views
    await prisma.property.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } }
    });

    return sendSuccess(res, 'Property retrieved successfully', property);
  } catch (error) {
    console.error('Get property error:', error);
    return sendError(res, 'Failed to get property', 500, error);
  }
};

export const createProperty = async (req, res) => {
  try {
    const { title, description, type, price, address, city, state, area, bedrooms, bathrooms, amenities, images, projectId } = req.body;

    // Validation
    if (!title || !type || !price || !address || !city || !state) {
      return sendError(res, 'Required fields: title, type, price, address, city, state', 400);
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        type,
        price: parseFloat(price),
        address,
        city,
        state,
        area: area ? parseFloat(area) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        amenities: amenities || [],
        images: images || [],
        agentId: req.user.id,
        ...(projectId && { projectId })
      },
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    return sendSuccess(res, 'Property created successfully', property, 201);
  } catch (error) {
    console.error('Create property error:', error);
    return sendError(res, 'Failed to create property', 500, error);
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (!property) {
      return sendError(res, 'Property not found', 404);
    }

    return sendSuccess(res, 'Property updated successfully', property);
  } catch (error) {
    console.error('Update property error:', error);
    return sendError(res, 'Failed to update property', 500, error);
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await prisma.property.delete({
      where: { id: req.params.id }
    });

    if (!property) {
      return sendError(res, 'Property not found', 404);
    }

    return sendSuccess(res, 'Property deleted successfully', { id: property.id });
  } catch (error) {
    console.error('Delete property error:', error);
    return sendError(res, 'Failed to delete property', 500, error);
  }
};
