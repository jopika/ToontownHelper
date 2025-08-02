import packageJson from '../../package.json';
import styled from 'styled-components';

export const FooterContainer = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 0;
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
