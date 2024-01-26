import { axiosClient } from './axios-client';

export function getWorkflowLog(id: string) {
    return axiosClient().get(`/${id}/log?logOptions.container=main&logOptions.follow=true`);

}