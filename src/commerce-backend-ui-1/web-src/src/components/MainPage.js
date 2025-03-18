import BazaarvoiceConfigForm from "./BazaarvoiceConfigForm";

export const MainPage = props => {
    const namespace = process.env.AIO_runtime_namespace
    const actionUrl = `https://${namespace}.adobeioruntime.net/api/v1/web/aio-commerce-bazaarvoice-app/bazaarvoice-config`
    return (
        <BazaarvoiceConfigForm actionUrl={actionUrl} />
    )
}
