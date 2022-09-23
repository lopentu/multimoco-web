import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Container } from '@mui/material';
import Image from 'next/image';
import ntulogo from '../public/images/ntulogo.png';

export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted' style={{ marginTop: "5em", paddingTop: "1em" }}>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>

      {/* <Container maxWidth="xl"> */}
      {/* <div>
            <a href='https://www.facebook.com/ntugil/' className='me-4 text-reset'>
              <MDBIcon fab icon="facebook-f" />
            </a> */}
      {/* <a href='' className='me-4 text-reset'>
              <MDBIcon fab icon="twitter" />
            </a>
            <a href='' className='me-4 text-reset'>
              <MDBIcon fab icon="google" />
            </a>
            <a href='' className='me-4 text-reset'>
              <MDBIcon fab icon="instagram" />
            </a>
            <a href='' className='me-4 text-reset'>
              <MDBIcon fab icon="linkedin" />
            </a>
            <a href='' className='me-4 text-reset'>
              <MDBIcon fab icon="github" />
            </a> */}
      {/* </div> */}
      {/* </Container> */}
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            {/* <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                Company name
              </h6>
              <p>
                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit.
              </p>
            </MDBCol> */}

            {/* <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Angular
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  React
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Vue
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Laravel
                </a>
              </p>
            </MDBCol> */}

            {/* <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Pricing
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Settings
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Orders
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Help
                </a>
              </p>
            </MDBCol> */}

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              {/* <h6 className='text-uppercase fw-bold mb-4'>Contact</h6> */}
          {/* <Image
            src={ntulogo}
            layout="fill"
            alt="NTU Logo"
            width={100}
            height={100}
          /> */}
              <p>
                <MDBIcon icon="home" className="me-2" />
                地址：10617 臺北市大安區羅斯福路四段1號 樂學館
              </p>
            </MDBCol>
            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <p>
                <MDBIcon icon="phone" className="me-3" /> 電話：+886-2-33664104 #301
              </p>
            </MDBCol>
            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <p>
                <MDBIcon icon="print" className="me-3" /> 傳真：+886-2-23635358
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        Copyright © {new Date().getFullYear()} &nbsp;
        <a className='text-reset fw-bold' href='linguistics.ntu.edu.tw'>
          National Taiwan University Graduate Institute of Linguistics
        </a>
      </div>

    </MDBFooter>
  );
}