import { attach } from "@adobe/uix-guest";
import { useEffect, useState } from "react";
import BazaarvoiceConfigForm from "./BazaarvoiceConfigForm";
import { EXTENSION_ID } from "../constants";
import { View } from "@adobe/react-spectrum";

export const MainPage = (props) => {
  const [imsToken, setImsToken] = useState(null);
  const [imsOrgId, setImsOrgId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const namespace = process.env.AIO_runtime_namespace;
  const actionUrl = `https://${namespace}.adobeioruntime.net/api/v1/web/bazaar-voice/`;

  useEffect(() => {
    // Load IMS token for calling require-adobe-auth: true actions
    const loadImsInfo = async () => {
      try {
        if (props.ims?.token) {
          // When running inside Experience Cloud Shell, IMS token and orgId can be accessed via props.ims.
          setImsToken(props.ims.token);
          setImsOrgId(props.ims.org);
        } else {
          // Commerce PaaS requires Admin UI SDK 3.0+ to access IMS info via sharedContext.
          // See https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/extension-points/#shared-contexts
          const guestConnection = await attach({ id: EXTENSION_ID });
          const context = guestConnection?.sharedContext;
          setImsToken(context?.get("imsToken"));
          setImsOrgId(context?.get("imsOrgId"));
        }
      } catch (error) {
        console.error("Error loading IMS info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImsInfo();
  }, []);

  return !isLoading ? (
    <BazaarvoiceConfigForm
      actionUrl={actionUrl}
      imsToken={imsToken}
      imsOrgId={imsOrgId}
    />
  ) : (
    <View></View>
  );
};
