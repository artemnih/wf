import {argoUrl} from '.';

export const buildContainerUrl = (argoName: string, argoPodId: string) => {
  return `${argoUrl()}/${argoName}/log?logOptions.container=main&logOptions.follow=true&podName=${argoPodId}`;
};
