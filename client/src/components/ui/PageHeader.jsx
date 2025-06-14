import styled from 'styled-components';
import { RoundedButton } from '../ui/Buttons';

const TitleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 20px;
`;

const LeftSection = styled.div`
  flex: 1 1 60%;
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ProfileHeader = styled.h1`
  margin: 0;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 4px;
  font-size: 0.9rem;
`;
 
export const PageHeader = ({
  title = 'Title',
  error,
  buttonText,
  buttonColor = 'black',
  buttonHoverBg = '#A4CCF5',
  buttonFontWeight = 'bold',
  buttonWidth = '149px',
  onButtonClick,
}) => (
  <TitleRow>
    <LeftSection>
      <ProfileHeader>{title}</ProfileHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LeftSection>

    {buttonText && (
      <RightSection>
        <RoundedButton
          bgColor={buttonColor}
          hoverBackgroundColor={buttonHoverBg}
          fontWeight={buttonFontWeight}
          width={buttonWidth}
          onClick={onButtonClick}
        >
          {buttonText}
        </RoundedButton>
      </RightSection>
    )}
  </TitleRow>
);
