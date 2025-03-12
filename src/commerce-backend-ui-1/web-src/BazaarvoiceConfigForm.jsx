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
} from "@adobe/react-spectrum";

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

    useEffect(() => {
        async function loadConfig() {
            try {
                const resp = await fetch(actionUrl);
                if (!resp.ok) throw new Error(`GET failed: HTTP ${resp.status}`);
                const data = await resp.json();
                console.log("Fetched config:", data);
                if (data.config) {
                    setEnableExtension(data.config.enableExtension || "no");
                    setEnvironment(data.config.environment || "staging");
                    setClientName(data.config.clientName || "");
                    setEnableProductFamilies(data.config.enableProductFamilies || "no");
                    setDeploymentZone(data.config.deploymentZone || "Main Site");
                    setLocale(data.config.locale || "");
                    setCloudSeoKey(data.config.cloudSeoKey || "");
                    setEnableBvPixel(data.config.enableBvPixel || "no");
                    setDebug(data.config.debug || "no");
                    setSftpUsername(data.config.sftpUsername || "");
                    setSftpPassword(data.config.sftpPassword || "");
                    setSftpHostName(data.config.sftpHostName || "");
                    setProductFeedFilename(data.config.productFeedFilename || "");
                    setProductFeedExportPath(data.config.productFeedExportPath || "");
                }
                setStatusMsg("Config loaded successfully");
            } catch (err) {
                console.error("Fetch error:", err);
                setStatusMsg(`Error loading config: ${err.message}`);
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
            const resp = await fetch(actionUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!resp.ok) throw new Error(`POST failed: HTTP ${resp.status}`);
            setStatusMsg(`Configuration saved successfully`);
        } catch (err) {
            setStatusMsg(`Error saving config: ${err.message}`);
        }
    }

    return (
        <View padding="size-250">
            <Heading level={1}>Bazaarvoice Config Editor</Heading>
            <Content marginBottom="size-200">{statusMsg}</Content>
            <Form maxWidth="size-6000">
                {/* General Configuration Section */}
                <Heading level={2} marginTop="size-200" marginBottom="size-100">
                    General Configuration
                </Heading>
                <Picker
                    label="Enable Bazaarvoice Extension"
                    selectedKey={enableExtension}
                    onSelectionChange={setEnableExtension}
                    isRequired
                >
                    <Item key="yes">Yes</Item>
                    <Item key="no">No</Item>
                </Picker>
                <Picker
                    label="Environment"
                    selectedKey={environment}
                    onSelectionChange={setEnvironment}
                    isRequired
                >
                    <Item key="staging">Staging</Item>
                    <Item key="production">Production</Item>
                </Picker>
                <TextField
                    label="Client Name"
                    value={clientName}
                    onChange={setClientName}
                    isRequired
                />
                <Picker
                    label="Enable BV Product Families"
                    selectedKey={enableProductFamilies}
                    onSelectionChange={setEnableProductFamilies}
                >
                    <Item key="yes">Yes</Item>
                    <Item key="no">No</Item>
                </Picker>
                <TextField
                    label="Deployment Zone"
                    value={deploymentZone}
                    onChange={setDeploymentZone}
                    defaultValue="Main Site"
                />
                <TextField label="Locale" value={locale} onChange={setLocale} />
                <TextField
                    label="Cloud SEO Key"
                    value={cloudSeoKey}
                    onChange={setCloudSeoKey}
                />
                <Picker
                    label="Enable BV Pixel"
                    selectedKey={enableBvPixel}
                    onSelectionChange={setEnableBvPixel}
                >
                    <Item key="yes">Yes</Item>
                    <Item key="no">No</Item>
                </Picker>
                <Picker label="Debug" selectedKey={debug} onSelectionChange={setDebug}>
                    <Item key="yes">Yes</Item>
                    <Item key="no">No</Item>
                </Picker>

                {/* Feed Section */}
                <Heading level={2} marginTop="size-200" marginBottom="size-100">
                    Feed
                </Heading>
                <TextField
                    label="SFTP Username"
                    value={sftpUsername}
                    onChange={setSftpUsername}
                />
                <TextField
                    label="SFTP Password"
                    value={sftpPassword}
                    onChange={setSftpPassword}
                    type="password"
                />
                <TextField
                    label="SFTP Host Name"
                    value={sftpHostName}
                    onChange={setSftpHostName}
                />
                <TextField
                    label="Product Feed Filename"
                    value={productFeedFilename}
                    onChange={setProductFeedFilename}
                />
                <TextField
                    label="Product Feed Export Path"
                    value={productFeedExportPath}
                    onChange={setProductFeedExportPath}
                />
                <Button variant="accent" onPress={handleSave}>
                    Save
                </Button>
            </Form>
        </View>
    );
}