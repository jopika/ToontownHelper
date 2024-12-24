import packageJson from '../../package.json';
import styled from 'styled-components';

export const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    bottom: 0;
    margin: 0 auto;
`;

export default function VersionBanner() {
    const version = packageJson.version;
    const footerBox = (
        <FooterContainer>
            Version: {version} Created by @jopika and @amyjzhu
        </FooterContainer>
    )


    return footerBox;
}