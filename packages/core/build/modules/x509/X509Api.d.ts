import { AgentContext } from '../../agent';
import { X509ModuleConfig } from './X509ModuleConfig';
import { X509CreateCertificateOptions, X509ValidateCertificateChainOptions } from './X509ServiceOptions';
/**
 * @public
 */
export declare class X509Api {
    private agentContext;
    config: X509ModuleConfig;
    constructor(agentContext: AgentContext, config: X509ModuleConfig);
    /**
     * Creates a X.509 certificate.
     *
     * @param options X509CreateCertificateOptions
     */
    createCertificate(options: X509CreateCertificateOptions): Promise<import("./X509Certificate").X509Certificate>;
    /**
     * Validate a certificate chain.
     *
     * @param options X509ValidateCertificateChainOptions
     */
    validateCertificateChain(options: X509ValidateCertificateChainOptions): Promise<import("./X509Certificate").X509Certificate[]>;
}
