import React from 'react';
import { red } from '@mui/material/colors';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const FeatureStacks = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '30%', paddingRight: '30%', paddingTop: '8%'}}>
      
      {/* Easy to Use: Icon Left, Text Right */}
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px',alignItems: 'center' }}>
        <AirplanemodeActiveIcon fontSize='large' style={{ marginRight: '20px', color: red[300] }} />
        <div >
          <h3>Easy to Use</h3>
          <p>Generate your trip with just one step</p>
        </div>
      </div>
      
      {/* Super Flexible: Icon Right, Text Left */}
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '20px' }}>
        <BrightnessMediumIcon fontSize='large' style={{ marginLeft: '20px', color: red[300] }} />
        <div>
          <h3>Beautiful UI</h3>
          <p>Choose your prefered mode</p>
        </div>
      </div>
      
      {/* Smart Helper: Icon Left, Text Right */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CloudDoneIcon fontSize='large' style={{ marginRight: '20px', color: red[300] }} />
        <div>
          <h3>Cloud Store</h3>
          <p>Remember your last trip details</p>
        </div>
      </div>

    </div>
  );
}

export default FeatureStacks;
