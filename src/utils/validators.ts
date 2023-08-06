import Joi from 'joi';

const DateSchema = Joi.date().required();

export const isDate = (data: string) => {
  const { error } = DateSchema.validate(data);
  if (error) {
    return {};
  } else {
    return true;
  }
};

export const isJSON = (str: string | undefined): boolean => {
  try {
    return !!str && !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};
