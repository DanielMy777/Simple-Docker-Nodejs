import { flterByFields } from '../../utils/FilterUtils';

const filterByDeploymentFields = (body: object) => {
    return flterByFields(body, ['imageId']);
};

export { filterByDeploymentFields };
