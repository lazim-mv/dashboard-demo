// import { axiosInstance } from '@/app/configs/axios'
// import React, { useState } from 'react'

// const useGetAllSource = () => {
//     const [sourceData, setSourceData] = useState<String[]>([])

//     const getAllSourceData = async () => {
//         try {
//             const res = await axiosInstance.get("/partners/lead-sources");
//             if (res.status === 200) {
//                 setSourceData(res.data.data)
//             }

//         } catch (error) {

//         }
//     }

//     return (
//         <div>useGetAllSource</div>
//     )
// }

// export default useGetAllSource