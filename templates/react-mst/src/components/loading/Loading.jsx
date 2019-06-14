import { Spin } from 'antd';
import styled from 'styled-components';

const Loading = styled(Spin)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 100000;

  .ant-spin-dot {
    margin: auto;
  }
`;

export default Loading;
