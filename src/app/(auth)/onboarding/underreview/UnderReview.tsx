import React from 'react'
import styles from "./underreview.module.css"
import Image from 'next/image'
import img1 from "../../../../../public/underreview.svg"
import { Button } from 'antd'

const UnderReview = () => {
    return (
        <div className={styles.container}>
            <div className={styles.innerContainer} >
                <div>
                    <Image src={img1} alt='under review' />
                </div>
                <div>
                    <h1>Application under Review</h1>
                    <p>Lorem ipsum dolor sit amet consectetur. Neque nascetur fames etiam nulla dui.</p>
                    <Button size='large' type='primary' shape='round'>Get Help</Button>
                </div>
            </div>
        </div>
    )
}

export default UnderReview