const { cloudinary } = require('../config/cloudinary.JS');
const { uploadOnCloudinary } = require('../config/cloudinary.JS')
const DB = require('./../models')

//-----ADD CAR -----------------------------------------------------//
const AddCarController = async (req, res) => {
  console.log("BODY:", req.body);

  try {
    const {
      name,
      brand,
      model,
      carType,
      features,
      pricePerHour,
      registrationNumber,
      location,
      documents,
      rating,
      status,
      createdBy,
      pricePerDay,
      // Flat fields
      city,
      color,
      transmission,
      fuelType,
      seatingCapacity,
      hasAC,
      hasGPS,
      bluetooth,
      insuranceValidTill,
      pollutionValidTill
    } = req.body

    // for single file upload
    // const cloudinaryResult= await uploadOnCloudinary(req.file.path)
    //     console.log("CLOUDINARY:", cloudinaryResult.secure_url);


    //----------for files more than 1 --------------------
    // const upload_images = req.files.map((val) => uploadOnCloudinary(val.path))
    // const upload_result =  await Promise.all(upload_images)
    // console.log("upload_image",upload_result);


    // const images = upload_result.map((val) => ({
    //   url : val.secure_url,
    //   public_id : val.public_id
    // }))
    // console.log("images",images);

    // ----- for cover images and gallery images -------------

    const cover_image = req.files?.coverImage || []
    const gallery_images = req.files?.galleryImages || []

    if (cover_image.length === 0) {
      return res.status(400).json({ message: "Cover image is required" })
    }

    const cover_result = await Promise.all(cover_image.map((val) => uploadOnCloudinary(val.path)))

    const gallery_result = await Promise.all(
      gallery_images.map((val) => uploadOnCloudinary(val.path))
    )

    if (cover_result.some(res => !res)) {
      return res.status(500).json({ success: false, message: "Failed to upload cover image to Cloudinary" })
    }

    const cover_image_data = {
      url: cover_result[0].secure_url,
      public_id: cover_result[0].public_id
    }
    const gallery_images_data = gallery_result
      .filter(val => val !== null)
      .map((val) => ({ url: val.secure_url, public_id: val.public_id }))
    
    console.log("Gallery files:", req.files?.galleryImages);
    console.log("Gallery data:", gallery_images_data);

    const car = await DB.CAR.create({
      name,
      brand,
      model,
      carType,
      features: {
        color: features?.color || color,
        transmission: features?.transmission || transmission,
        fuelType: features?.fuelType || fuelType,
        seatingCapacity: features?.seatingCapacity || seatingCapacity,
        hasAC: (features?.hasAC || hasAC) === 'on' || (features?.hasAC || hasAC) === true,
        hasGPS: (features?.hasGPS || hasGPS) === 'on' || (features?.hasGPS || hasGPS) === true,
        bluetooth: (features?.bluetooth || bluetooth) === 'on' || (features?.bluetooth || bluetooth) === true
      },
      pricePerHour,
      pricePerDay,
      registrationNumber,
      location: location || { city: city },
      documents: documents || {
        insuranceValidTill,
        pollutionValidTill
      },
      coverImage: cover_image_data,
      galleryImages: gallery_images_data,
      rating,
      status: status || 'available',
      approvalStatus: 'approved', // Admin/Owner added cars are approved by default
      createdBy: req.user?._id || req.body.createdBy
    })

    return res.status(201).json({
      success: true,
      message: "Car added successfully",
      car,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    })
  }
}

//-----SUBMIT CAR (USER) -----------------------------------------------------//
const SubmitCarController = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      carType,
      features,
      pricePerHour,
      pricePerDay,
      registrationNumber,
      location,
      documents,
      status,
      // Flat fields from form-data if not nested
      city,
      color,
      transmission,
      fuelType,
      seatingCapacity,
      hasAC,
      hasGPS,
      bluetooth,
      insuranceValidTill,
      pollutionValidTill
    } = req.body

    const cover_image = req.files?.coverImage || []
    const gallery_images = req.files?.galleryImages || []

    if (cover_image.length === 0) {
      return res.status(400).json({ message: "Cover image is required" })
    }

    const cover_result = await Promise.all(cover_image.map((val) => uploadOnCloudinary(val.path)))
    const gallery_result = await Promise.all(
      gallery_images.map((val) => uploadOnCloudinary(val.path))
    )

    if (cover_result.some(res => !res)) {
      return res.status(500).json({ success: false, message: "Failed to upload cover image to Cloudinary" })
    }

    const cover_image_data = {
      url: cover_result[0].secure_url,
      public_id: cover_result[0].public_id
    }
    const gallery_images_data = gallery_result
      .filter(val => val !== null)
      .map((val) => ({ url: val.secure_url, public_id: val.public_id }))
    
    
    // features is now optional if flat fields are provided

    // Force approvalStatus to pending and isActive to false (or true depending on design, but pending is safe)
    const car = await DB.CAR.create({
      name,
      brand,
      model,
      carType,
      features: {
        color: features?.color || color,
        transmission: features?.transmission || transmission,
        fuelType: features?.fuelType || fuelType,
        seatingCapacity: features?.seatingCapacity || seatingCapacity,
        hasAC: (features?.hasAC || hasAC) === 'on' || (features?.hasAC || hasAC) === true,
        hasGPS: (features?.hasGPS || hasGPS) === 'on' || (features?.hasGPS || hasGPS) === true,
        bluetooth: (features?.bluetooth || bluetooth) === 'on' || (features?.bluetooth || bluetooth) === true
      },
      pricePerHour,
      pricePerDay,
      registrationNumber,
      location: location || { city: city },
      coverImage: cover_image_data,
      galleryImages: gallery_images_data,
      documents: documents || {
        insuranceValidTill,
        pollutionValidTill
      },
      status: status || 'available',
      approvalStatus: 'pending',
      createdBy: req.user?._id
    })

    // Create a notification for admin
    await DB.NOTIFICATION.create({
      recipient: 'admin',
      title: 'New Car Submission',
      message: `A new car "${name}" has been submitted for approval by ${req.user?.name || 'a user'}.`,
      type: 'car_submission',
      relatedId: car._id,
      onModel: 'cars'
    });

    return res.status(201).json({
      success: true,
      message: "Car submitted successfully. Pending admin approval.",
      car,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    })
  }
}

//-----VIEW CAR -----------------------------------------------------//

const GetAllCarsController = async function (req, res) {
  try {
    let { page, limit } = req.query

    page = Number(page)
    limit = Number(limit)
    const skip = (page - 1) * limit

    const cars = await DB.CAR.find({ isActive: true, approvalStatus: 'approved' })
      .populate('brand', 'name')
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .lean();

    const total_cars = await DB.CAR.countDocuments({ isActive: true, approvalStatus: 'approved' })
    if (!cars) return res.status(400).json({
      success: false,
      message: 'there is no car data to fetch'
    })

    return res.status(200).json({
      success: true,
      totalCars: total_cars,
      cars
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cars',
      error: error.message
    })
  }
}

//-----GET CAR BY ID -----------------------------------------------------//

const GetCarByIdController = async function (req, res) {
  try {
    const { id } = req.params;

    const car = await DB.CAR.findById(id)
      .populate('brand', 'name country logo')
      .populate('createdBy', 'name email role contactNumber')
      .lean();

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    return res.status(200).json({
      success: true,
      car
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car details',
      error: error.message
    });
  }
}

//-----DELETE CAR -----------------------------------------------------//

const DeleteCarContoller = async function (req, res) {

  try {
    const { id } = req.params

    const car = await DB.CAR.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    // Soft delete: Update status to inactive, keep images in Cloudinary so it can be restored
    const deletedCar = await DB.CAR.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )

    if (!deletedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully (soft delete)',
      car: deletedCar
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete car',
      error: error.message
    })
  }

}

//-----UPDATE CAR -----------------------------------------------------//

const UpdateCarController = async function (req, res) {
  try {
    const { id } = req.params
    const {
      name,
      brand,
      model,
      carType,
      features,
      pricePerHour,
      registrationNumber,
      location,
      isActive,
      rating,
      status,
      approvalStatus,
      createdBy
    } = req.body


    const update_car = await DB.CAR.findByIdAndUpdate(id, {
      name,
      brand,
      model,
      carType,
      features,
      pricePerHour,
      registrationNumber,
      location,
      isActive,
      rating,
      status,
      approvalStatus,
      createdBy: req.user?._id
    }, { new: true })
      .populate('brand', 'name')

    if (!update_car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      car: update_car
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Failed to update car',
      error: error.message
    })
  }
}


module.exports = {
  AddCarController,
  SubmitCarController,
  GetAllCarsController,
  GetCarByIdController,
  DeleteCarContoller,
  UpdateCarController
}