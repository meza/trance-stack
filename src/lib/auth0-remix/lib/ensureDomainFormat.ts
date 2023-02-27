export const ensureDomain = (domain: string) => {
  if (!domain) {
    throw new Error('Domain is not defined');
  }
  const domainWithoutProtocol = domain.replace(/(^\w+:|^)\/\//, '');
  const domainWithoutProtocolAndTrailingSlash = domainWithoutProtocol.replace(/\/$/, '');
  return `https://${domainWithoutProtocolAndTrailingSlash}`;
};
