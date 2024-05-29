import { settingKeyName } from '@constants/masterData';
import { settingSystemSelector } from '@selectors/app';
import React from 'react';
import { useSelector } from 'react-redux';
const useTrainingUnit = () => {
    const settingSystem = useSelector(settingSystemSelector);
    const training = settingSystem?.find((item) => item?.keyName === settingKeyName.TRAINING_UNIT);
    const bug = settingSystem?.find((item) => item?.keyName === settingKeyName.BUG_UNIT);
    return {
        trainingUnit: training?.valueData,
        bugUnit: bug?.valueData,
    };
};

export default useTrainingUnit;
