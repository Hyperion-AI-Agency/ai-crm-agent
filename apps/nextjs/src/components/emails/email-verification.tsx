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

interface EmailVerificationTemplateProps {
  verificationUrl: string;
}

export const EmailVerificationTemplate = ({ verificationUrl }: EmailVerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to complete your sign up</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email address</Heading>
          <Text style={text}>
            Thanks for signing up! Please click the button below to verify your email address and
            complete your account setup.
          </Text>
          <Section style={buttonContainer}>
            <Link href={verificationUrl} style={button}>
              Verify Email Address
            </Link>
          </Section>
          <Text style={text}>
            If you didn&apos;t create an account, you can safely ignore this email.
          </Text>
          <Text style={text}>This link will expire in 24 hours for security reasons.</Text>
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

export default EmailVerificationTemplate;
