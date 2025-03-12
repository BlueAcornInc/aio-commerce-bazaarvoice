import React from "react";
import { Provider } from "@react-spectrum/provider";
import { theme } from "@react-spectrum/theme-default";
import BazaarvoiceConfigForm from "./BazaarvoiceConfigForm.jsx";
import ExtensionRegistration from "./ExtensionRegistration.jsx";
import ReactDOM from "react-dom";

export default function App() {
    const namespace =
        (typeof process !== "undefined" && process.env.__OW_NAMESPACE) ||
        "your-namespace";
    const appName = "aio-commerce-bazaarvoice-app";
    const ACTION_URL = `/api/v1/web/${appName}/bazaarvoice-config`;
    console.log("ACTION_URL:", ACTION_URL);
    return (
        <Provider theme={theme} colorScheme="light">
            <ExtensionRegistration />
            <BazaarvoiceConfigForm actionUrl={ACTION_URL} />
        </Provider>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));