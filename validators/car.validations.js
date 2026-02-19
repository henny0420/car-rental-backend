const joi =  require("joi")

const addCarValidator = {
    body : joi.object({
        name : joi.string().required(),
        brand : joi.string().required(),
        model : joi.string().required(),
        carType: joi.string()
                .valid(
                'sedan',
                'suv',
                'sports car',
                'jeep',
                'van',
                'convertible',
                'hatchback'
                )
                .required(),
                features : joi.object({
                    color : joi.string().required(),
                    transmission : joi.string().required(),
                    fuelType : joi.string().required(),
                    seatingCapacity :joi.number().integer().min(1).required(),
                    hasAC: joi.boolean(),
                    hasGPS: joi.boolean(),
                    bluetooth: joi.boolean()
                }).required(),

                pricePerHour: joi.number().min(0).required(),
                status: joi.string().default('available'),
                registrationNumber: joi.string().required(),
                documents: joi.object({
                            insuranceValidTill: joi.date(),
                            pollutionValidTill: joi.date()
                        }),

                rating: joi.object({
                avg: joi.number().min(0).max(5).default(0),
                count: joi.number().min(0).default(0)
        }),

            coverImage: joi.object({
                url: joi.string().uri().required(),
                public_id: joi.string().required()
            }).required(),

            galleryImages: joi.array().items(
                joi.object({
                url: joi.string().uri().required(),
                public_id: joi.string().required()
                })
            ).default([]),

            location: joi.object({
                city: joi.string().required()
            }).required(),

            isActive: joi.boolean().default(true),

            // createdBy: objectId
            }).options({
            abortEarly: false,
            allowUnknown: false

    })
}

module.exports = {addCarValidator}