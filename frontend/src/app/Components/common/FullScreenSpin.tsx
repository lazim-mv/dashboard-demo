import React, { useState } from 'react';
import { Spin } from 'antd';

interface FullScreenLoaderProps {
    isLoading: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isLoading }) => {
    const [percent, setPercent] = useState(0);

    React.useEffect(() => {
        if (isLoading) {
            let ptg = -10;
            const interval = setInterval(() => {
                ptg += 5;
                setPercent(ptg);
                if (ptg > 120) {
                    clearInterval(interval);
                    setPercent(0);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    return <Spin spinning={isLoading} percent={percent} fullscreen />;
};

export default FullScreenLoader;