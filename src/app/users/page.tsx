"use client"

import { useGetUsersQuery } from '@/state/api'
import React from 'react'
import { useAppSelector } from '../redux';
import Header from '@/components/Header';
import { DataGrid, GridColDef , GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Image from 'next/image';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

//adding filters and export buttons in the head of the grid
const CustomToolbar = () => (
    <GridToolbarContainer className='toolbar flex gap-2'>
        <GridToolbarFilterButton/>
        <GridToolbarExport />
    </GridToolbarContainer>
);

//Contruct grid with the fields
const columns : GridColDef[] =[
    {field : "userId" , headerName : "ID" , width: 100},
    {field : "username" , headerName : "Username" , width: 150},
    {field : "profilePictureUrl" , headerName : "Profile Picture" , width: 100,
        //styling the profile image
        renderCell : (params) => (
            <div className='flex h-full w-full items-center justify-center'>
             <div className='h-9 w-9'>
                <Image
                src={`/${params.value}`}
                alt={params.row.username}
                width={100}
                height={50}
                className='h-full rounded-full object-cover'
                />
             </div>
            </div>
        )
    },
    {field : "teamId" , headerName : "Team ID" , width: 100},
]

const Users = () => {
    const {data : users , isLoading ,isError} = useGetUsersQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if(isLoading) return <div>Loading...</div>;
    if(isError) return <div>Error fetching users...</div>;
  return <div className='flex w-full flex-col p-8'>
  <Header name="Users" />
  <div style={{height:650,width:"100%"}}>
     <DataGrid 
     rows={users || []}
     columns={columns}
     getRowId={(row) => row.userId}
     pagination
     //adding filters and export buttons in the head of the grid
     slots={{
        toolbar : CustomToolbar,
     }}
     className={dataGridClassNames}
     sx = {dataGridSxStyles(isDarkMode)}
     />
  </div>
  </div>
}

export default Users