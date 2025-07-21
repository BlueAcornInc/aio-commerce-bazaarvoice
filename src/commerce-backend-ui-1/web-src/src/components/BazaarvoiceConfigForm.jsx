import React, { useState } from "react";
import {
  Button,
  Form,
  TextField,
  Heading,
  Content,
  View,
  Picker,
  Item,
  Grid,
  Text,
} from "@adobe/react-spectrum";
import {
  useBazaarvoiceConfigLoader,
  useBazaarvoiceConfigSaver,
} from "../hooks/useBazaarVoiceConfig";

const DEBUG = false;

/**
 *
 * @param props
 */
export default function BazaarvoiceConfigForm(props) {
  const [formState, setFormState] = useState({
    enableExtension: "no",
    environment: "staging",
    clientName: "",
    enableProductFamilies: "no",
    deploymentZone: "Main Site",
    locale: "",
    cloudSeoKey: "",
    enableBvPixel: "no",
    debug: "no",
  });

  const { statusMsg: loadStatusMsg, hasError: loadHasError } =
    useBazaarvoiceConfigLoader(props, setFormState);

  const {
    saveConfig,
    statusMsg: saveStatusMsg,
    hasError: saveHasError,
  } = useBazaarvoiceConfigSaver(props);

  const handleChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    saveConfig(formState);
  };

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
      {DEBUG && loadStatusMsg && (
        <Content marginBottom="size-200" UNSAFE_style={{ color: "#d2691e" }}>
          {loadStatusMsg}
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
        <Heading level={3} marginTop="size-200" marginBottom="size-100">
          General Configuration
        </Heading>

        <Picker
          label="Enable Bazaarvoice Extension"
          selectedKey={formState.enableExtension}
          onSelectionChange={(val) => handleChange("enableExtension", val)}
          isRequired
          isDisabled={loadHasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>

        <Picker
          label="Environment"
          selectedKey={formState.environment}
          onSelectionChange={(val) => handleChange("environment", val)}
          isRequired
          isDisabled={loadHasError}
        >
          <Item key="staging">Staging</Item>
          <Item key="production">Production</Item>
        </Picker>

        <TextField
          label="Client Name"
          value={formState.clientName}
          onChange={(val) => handleChange("clientName", val)}
          isRequired
          isDisabled={loadHasError}
        />

        <Picker
          label="Enable BV Product Families"
          selectedKey={formState.enableProductFamilies}
          onSelectionChange={(val) =>
            handleChange("enableProductFamilies", val)
          }
          isDisabled={loadHasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>

        <TextField
          label="Deployment Zone"
          value={formState.deploymentZone}
          onChange={(val) => handleChange("deploymentZone", val)}
          isDisabled={loadHasError}
        />

        <TextField
          label="Locale"
          value={formState.locale}
          onChange={(val) => handleChange("locale", val)}
          isDisabled={loadHasError}
        />

        <TextField
          label="Cloud SEO Key"
          value={formState.cloudSeoKey}
          onChange={(val) => handleChange("cloudSeoKey", val)}
          isDisabled={loadHasError}
        />

        <Picker
          label="Enable BV Pixel"
          selectedKey={formState.enableBvPixel}
          onSelectionChange={(val) => handleChange("enableBvPixel", val)}
          isDisabled={loadHasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>

        <Picker
          label="Debug"
          selectedKey={formState.debug}
          onSelectionChange={(val) => handleChange("debug", val)}
          isDisabled={loadHasError}
        >
          <Item key="yes">Yes</Item>
          <Item key="no">No</Item>
        </Picker>

        <Button variant="accent" onPress={handleSave} isDisabled={loadHasError}>
          Save
        </Button>

        {saveHasError && (
          <Content UNSAFE_style={{ color: "#b0b0b0" }}>
            <br />
            {saveStatusMsg}
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
                  "*",
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
