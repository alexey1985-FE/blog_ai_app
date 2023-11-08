import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components';

interface SubscribeEmailProps {
  email: string;
  user: string
}

const SubscribeEmail: React.FC<Readonly<SubscribeEmailProps>> = ({
  email, user
}) => (
  <Html>
    <Head />
    <Preview>Thank you for subscription to us</Preview>
    <Tailwind>
      <Body className='text-black'>
        <Container>
          <Section className='my-10 px-5 py-4 rounded-md bg-white border-black'>
            <Heading className='leading-tight text-2xl'>Coming Soon</Heading>
            <Text className='text-lg'>
              Thank you, <span className='text-indigo-600'>{user}</span> for your subscription to our blog site.
            </Text>
            <Hr />
            <Text className='text-lg'>We will send you a note when we have something new to share on your email: {email}.</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default SubscribeEmail;





