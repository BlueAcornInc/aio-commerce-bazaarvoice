import React from "react";
import { View, Content, Heading, Link, Flex, Image } from "@adobe/react-spectrum";

export default function BazaarvoiceConfigForm() {
    return (
        <View padding="size-250" maxWidth="size-6000">
            {/* Bazaarvoice Logo */}
            <Flex justifyContent="center" marginBottom="size-400">
                <Image
                    src="https://www.intershop.com/assets/images/d/bazaarvoice-26dbd8cd.webp" // Replace with the actual path to the Bazaarvoice logo
                    alt="Bazaarvoice Logo"
                    width="size-2400"
                    height="size-1200"
                    objectFit="contain"
                />
            </Flex>

            {/* Links Section */}
            <Content marginBottom="size-400">
                <Flex direction="column" gap="size-200" alignItems="center">
                    <Link>
                        <a href="https://www.bazaarvoice.com/documentation" target="_blank" rel="noopener noreferrer">
                            Documentation
                        </a>
                    </Link>
                    <Link>
                        <a href="https://www.bazaarvoice.com/user-guide" target="_blank" rel="noopener noreferrer">
                            User Guide
                        </a>
                    </Link>
                    <Link>
                        <a href="https://www.bazaarvoice.com/faq" target="_blank" rel="noopener noreferrer">
                            FAQ
                        </a>
                    </Link>
                    <Link>
                        <a href="https://www.bazaarvoice.com/submit-a-bug" target="_blank" rel="noopener noreferrer">
                            Submit a Bug
                        </a>
                    </Link>
                    <Link>
                        <a href="https://www.bazaarvoice.com/support" target="_blank" rel="noopener noreferrer">
                            Support
                        </a>
                    </Link>
                </Flex>
            </Content>
        </View>
    );
}