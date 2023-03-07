# 10. Auth by Auth0

Date: 2023-02-20

## Status

Accepted

## Context

There are a lot of things to concern when deciding on an authentication strategy. We need to consider the following:

1. **Security:** The authentication strategy should provide a high level of security to
   prevent unauthorized access to the system. It is important to evaluate the security
   features of the authentication solution, such as encryption and protection against
   attacks like brute force and phishing.

2. **User Experience:** The authentication strategy should be designed to provide a
   positive user experience that encourages adoption and usage of the system. This can
   include features such as passwordless authentication, multi-factor authentication,
   or single sign-on (SSO) to streamline the authentication process.

3. **Compatibility:** The authentication strategy should be compatible with the
   software stack and architecture of the system, as well as any external systems that
   may need to interact with the application.

4. **Scalability:** The authentication strategy should be able to scale to accommodate
   future growth and expansion of the system. It's important to consider how the
   authentication solution will perform under heavy loads or increased user demand.

5. **Integration:** The authentication strategy should be able to integrate with
   existing identity management systems and protocols, such as LDAP or OAuth. This can
   help streamline the authentication process and reduce complexity.

6. **Regulatory Compliance:** The authentication strategy should comply with relevant
   regulations and standards, such as GDPR or HIPAA. This can help ensure that user data
   is protected and that the system is compliant with legal and industry requirements.

7. **Cost:** The cost of implementing and maintaining the authentication strategy
   should be taken into account, including any licensing, hardware, or personnel costs.
   It's important to find a solution that meets the organization's needs while staying
   within budget.


## Decision

Based on the above, we decided to use Auth0 as our authentication provider.
Auth0 provides a comprehensive authentication solution that is easy to integrate with and
provides a wide range of features and capabilities.

It also provides a familiar and intuitive user experience that is easy to adopt and use.


## Consequences

- Auth0 gives us the benefit of separating the user management and storage from the application.
- When the application scales, costs will incur for the Auth0 service.
