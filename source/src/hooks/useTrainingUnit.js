import { settingKeyName } from '@constants/masterData';
import { settingSystemSelector } from '@selectors/app';
import React from 'react';
import { useSelector } from 'react-redux';
const useTrainingUnit = () => {
    const settingSystem = useSelector(settingSystemSelector);
    const trainingUnit = settingSystem?.find((item) => item?.keyName === settingKeyName.TRAINING_UNIT);
    return trainingUnit?.valueData;
};

export default useTrainingUnit;
