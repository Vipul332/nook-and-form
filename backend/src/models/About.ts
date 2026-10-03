import { Document, Model, Schema, model } from "mongoose";

/* =========================================================
   Interfaces
========================================================= */

export interface IAboutSection {
  title: string;
  description: string;
  order: number;
}

export interface IAbout extends Document {
  hero: {
    title: string;
    subtitle: string;
    image?: string;
  };

  studioStory: {
    title: string;
    description: string;
    image?: string;
  };

  philosophy: {
    title: string;
    description: string;
  };

  principles: IAboutSection[];

  approach: IAboutSection[];

  designLanguage: {
    title: string;
    description: string;
    images: string[];
  };

  cta: {
    title: string;
    description: string;
    buttonText: string;
  };

  published: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   Reusable Section Schema
========================================================= */

const aboutSectionSchema = new Schema<IAboutSection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   About Schema
========================================================= */

const aboutSchema = new Schema<IAbout>(
  {
    hero: {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      subtitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },

      image: {
        type: String,
        trim: true,
      },
    },

    studioStory: {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },

      image: {
        type: String,
        trim: true,
      },
    },

    philosophy: {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },
    },

    principles: {
      type: [aboutSectionSchema],
      default: [],
    },

    approach: {
      type: [aboutSectionSchema],
      default: [],
    },

    designLanguage: {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },

      images: {
        type: [String],
        default: [],
      },
    },

    cta: {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      buttonText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================================================
   Model
========================================================= */

const About: Model<IAbout> = model<IAbout>(
  "About",
  aboutSchema
);

export default About;