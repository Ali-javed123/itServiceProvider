
 import { Document } from "mongoose";

export interface IFeature {
  title: string;
  description: string;
  icon: string;
}

export interface IPage extends Document {
  title: string;
  description: string;

  image_one: {
    url: string;
    public_id: string;
  };
  image_two : {
    url: string;
    public_id: string;
  };

  imgIcon1: string;
  imgIcon2: string;

  cardTitle: string;
  cardDescription: string;

  // featureIcon: string;

  features: IFeature[];

  btnText: string;

  createdAt: Date;
  updatedAt: Date;
}





export interface CreatePageDto {
    title: string;
    description: string;

    imgIcon1: string;
    imgIcon2: string;

    cardTitle: string;
    cardDescription: string;

    // featureIcon: string;

    btnText: string;

    features: {
        title: string;
        description: string;
        icon: string;
    }[];
}

export interface UpdatePageDto extends Partial<CreatePageDto> {}
