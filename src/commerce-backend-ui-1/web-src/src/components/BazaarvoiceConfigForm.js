import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  TextField,
  Heading,
  Content,
  View,
  Picker,
  Item,
  Switch,
  Grid,
  Text,
} from "@adobe/react-spectrum";

const DEBUG = false; // Set to true for detailed error messages

export default function BazaarvoiceConfigForm({ actionUrl }) {
  const [enableExtension, setEnableExtension] = useState("no");
  const [environment, setEnvironment] = useState("staging");
  const [clientName, setClientName] = useState("");
  const [enableProductFamilies, setEnableProductFamilies] = useState("no");
  const [deploymentZone, setDeploymentZone] = useState("Main Site");
  const [locale, setLocale] = useState("");
  const [cloudSeoKey, setCloudSeoKey] = useState("");
  const [enableBvPixel, setEnableBvPixel] = useState("no");
  const [debug, setDebug] = useState("no");
  const [sftpUsername, setSftpUsername] = useState("");
  const [sftpPassword, setSftpPassword] = useState("");
  const [sftpHostName, setSftpHostName] = useState("");
  const [productFeedFilename, setProductFeedFilename] = useState("");
  const [productFeedExportPath, setProductFeedExportPath] = useState("");
  const [statusMsg, setStatusMsg] = useState("Loading config...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const resp = await fetch(`${actionUrl}api-get-config`);
        if (!resp.ok) throw new Error(`GET failed: HTTP ${resp.status}`);
        const data = await resp.json();
        if (data) {
          setEnableExtension(data.enableExtension || "no");
          setEnvironment(data.environment || "staging");
          setClientName(data.clientName || "");
          setEnableProductFamilies(data.enableProductFamilies || "no");
          setDeploymentZone(data.deploymentZone || "Main Site");
          setLocale(data.locale || "");
          setCloudSeoKey(data.cloudSeoKey || "");
          setEnableBvPixel(data.enableBvPixel || "no");
          setDebug(data.debug || "no");
          setSftpUsername(data.sftpUsername || "");
          setSftpPassword(data.sftpPassword || "");
          setSftpHostName(data.sftpHostName || "");
          setProductFeedFilename(data.productFeedFilename || "");
          setProductFeedExportPath(data.productFeedExportPath || "");
        }
        setStatusMsg("Config loaded successfully");
        setHasError(false);
      } catch (err) {
        setHasError(true);
        if (DEBUG) {
          setStatusMsg(`Error loading config: ${err.message}`);
        } else {
          setStatusMsg("");
          console.log("Error loading config:", err);
        }
      }
    }
    loadConfig();
  }, [actionUrl]);

  async function handleSave() {
    const body = {
      enableExtension,
      environment,
      clientName,
      enableProductFamilies,
      deploymentZone,
      locale,
      cloudSeoKey,
      enableBvPixel,
      debug,
      sftpUsername,
      sftpPassword,
      sftpHostName,
      productFeedFilename,
      productFeedExportPath,
    };

    try {
      const resp = await fetch(`${actionUrl}api-store-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`POST failed: HTTP ${resp.status}`);
      setStatusMsg(`Configuration saved successfully`);
      setHasError(false);
    } catch (err) {
      setHasError(true);
      if (DEBUG) {
        setStatusMsg(`Error saving config: ${err.message}`);
      } else {
        setStatusMsg("");
        console.error("Error saving config:", err);
      }
    }
  }

  const links = [
    { label: "Blue Acorn iCi", url: "https://blueacornici.com/" },
    {
      label: "Create an Issue",
      url: "https://github.com/BlueAcornInc/aio-commerce-bazaarvoice/issues/new",
    },
    {
      label: "Issue Tracker",
      url: "https://github.com/BlueAcornInc/aio-commerce-bazaarvoice/issues",
    },
    { label: "Contact Us", url: "apps@blueacornici.com" },
    { label: "Documentation", url: "https://apps.blueacornici.shop/" },
  ];

  return (
    <View padding="size-250">
      {DEBUG && statusMsg && (
        <Content marginBottom="size-200" UNSAFE_style={{ color: "#d2691e" }}>
          {statusMsg}
        </Content>
      )}

      <Heading level={3}>Storefront Blocks</Heading>

      <Content>
        Bazaarvoice must also be configured in the Adobe Commerce Storefront
        configs.json.
        <br />
        <br />
      </Content>

      <Form maxWidth="size-6000">
        {/* General Configuration Section */}
        <Heading level={3} marginTop="size-200" marginBottom="size-100">
          General Configuration
        </Heading>
        <Picker
          label="Enable Bazaarvoice Extension"
          selectedKey={enableExtension}
          onSelectionChange={setEnableExtension}
          isRequired
          isDisabled={hasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>
        <Picker
          label="Environment"
          selectedKey={environment}
          onSelectionChange={setEnvironment}
          isRequired
          isDisabled={hasError}
        >
          <Item key="staging">Staging</Item>
          <Item key="production">Production</Item>
        </Picker>
        <TextField
          label="Client Name"
          value={clientName}
          onChange={setClientName}
          isRequired
          isDisabled={hasError}
        />
        <Picker
          label="Enable BV Product Families"
          selectedKey={enableProductFamilies}
          onSelectionChange={setEnableProductFamilies}
          isDisabled={hasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>
        <TextField
          label="Deployment Zone"
          value={deploymentZone}
          onChange={setDeploymentZone}
          defaultValue="Main Site"
          isDisabled={hasError}
        />
        <TextField
          isDisabled={hasError}
          label="Locale"
          value={locale}
          onChange={setLocale}
        />

        {/* Expanded General Settings Section

        <TextField
          label="Client Name"
          value={clientName}
          onChange={setClientName}
          isRequired
          isDisabled={hasError}
        />
        <Picker
          label="Enable BV Product Families"
          selectedKey={enableProductFamilies}
          onSelectionChange={setEnableProductFamilies}
          isDisabled={hasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>
        <TextField
          label="Deployment Zone"
          value={deploymentZone}
          onChange={setDeploymentZone}
          defaultValue="Main Site"
          isDisabled={hasError}
        />
        <TextField label="Locale" value={locale} onChange={setLocale} sDisabled={hasError} />
        <TextField
          label="Cloud SEO Key"
          value={cloudSeoKey}
          onChange={setCloudSeoKey}
          isDisabled={hasError}
        />
        <Picker
          label="Enable BV Pixel"
          selectedKey={enableBvPixel}
          onSelectionChange={setEnableBvPixel}
          isDisabled={hasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>
        <Picker isDisabled={hasError} label="Debug" selectedKey={debug} onSelectionChange={setDebug}>
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>
        */}
        {/* Feed Section
        <Heading level={2} marginTop="size-200" marginBottom="size-100">
          Feed
        </Heading>
        <TextField
          label="SFTP Username"
          value={sftpUsername}
          onChange={setSftpUsername}
          isDisabled={hasError}
        />
        <TextField
          label="SFTP Password"
          value={sftpPassword}
          onChange={setSftpPassword}
          type="password"
          isDisabled={hasError}
        />
        <TextField
          label="SFTP Host Name"
          value={sftpHostName}
          onChange={setSftpHostName}
          isDisabled={hasError}
        />
        <TextField
          label="Product Feed Filename"
          value={productFeedFilename}
          onChange={setProductFeedFilename}
          isDisabled={hasError}
        />
        <TextField
          label="Product Feed Export Path"
          value={productFeedExportPath}
          onChange={setProductFeedExportPath}
          isDisabled={hasError}
        />
*/}

        <Button variant="accent" onPress={handleSave} isDisabled={hasError}>
          Save
        </Button>

        {hasError && (
          <Content UNSAFE_style={{ color: "#b0b0b0" }}>
            <br />
            Secure configuration management is not yet supported. Please manage
            any setting with environment variables.
          </Content>
        )}

        <br />
        <br />
        <Heading level={3}>Support</Heading>
        <Grid columns={["1fr 1fr"]} gap="size-200" width="size-3600">
          {links.map((link) => (
            <View
              key={link.url}
              borderWidth="thin"
              borderColor="dark"
              padding="size-200"
              borderRadius="medium"
              onClick={() => {
                window.parent.postMessage(
                  { type: "open-link", url: link.url },
                  "*"
                );
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <Text>
                <b>{link.label}</b>: {link.url}
              </Text>
            </View>
          ))}
        </Grid>
      </Form>
    </View>
  );
}
