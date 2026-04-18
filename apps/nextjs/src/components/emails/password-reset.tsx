import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetTemplateProps {
  resetUrl: string;
}

export const PasswordResetTemplate = ({ resetUrl }: PasswordResetTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            We received a request to reset your password. Click the button below to create a new
            password.
          </Text>
          <Section style={buttonContainer}>
            <Link href={resetUrl} style={button}>
              Reset Password
            </Link>
          </Section>
          <Text style={text}>
            If you didn&apos;t request a password reset, you can safely ignore this email. Your
            password will remain unchanged.
          </Text>
          <Text style={text}>This link will expire in 1 hour for security reasons.</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#000000",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#000000",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const buttonContainer = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1e4a70",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  width: "fit-content",
};

export default PasswordResetTemplate;
