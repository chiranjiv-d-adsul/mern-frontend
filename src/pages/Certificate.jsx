import React, { useState, useEffect } from 'react';
import axios from 'axios';
// const BASE_URL = 'http://localhost:3000/';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/`);
      setCertificates(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching certificate data:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:3000/create`, { name, course, date });
      // After successfully creating certificate, fetch updated data
      fetchData();
      // Clear form fields
      setName('');
      setCourse('');
      setDate('');
    } catch (error) {
      console.error('Error creating certificate:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete/${id}`);
      // After successfully deleting certificate, fetch updated data
      fetchData();
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };
  const handleUpdate = async () => {
    try {
      // Send only the necessary data to the server for updating
      const { _id, name, course, date } = selectedCertificate;
      await axios.put(`http://localhost:3000/update/${_id}`, { name, course, date });
      // After successfully updating certificate, fetch updated data
      fetchData();
      setSelectedCertificate(null);
    } catch (error) {
      console.error('Error updating certificate:', error);
    }
  };


  const handleView = (certificate) => {
    setSelectedCertificate(certificate);
  };

  // const storeDriveLinkInDB = async (certificate, webViewLink) => {
  //   try {
  //     const response = await axios.post(`http://localhost:3000/store-drive-link`, {
  //       certificateId: certificate._id,

  //       webViewLink: webViewLink, // Corrected property name
  //     });
  //     console.log(webViewLink)
  //     console.log('Drive link stored in database:', response.data);
  //   } catch (error) {
  //     console.error('Error storing Drive link in database:', error);
  //   }
  // };

  // const storeDriveLinkInDB = async (certificate, driveLink) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/store-drive-link', {
  //       certificateId: certificate._id,
  //       driveLink: driveLink,
  //       weblink: driveLink.webViewLink,

  //     });
  //     console.log(driveLink);
  //     console.log(webViewLink)
  //     console.log('Drive link stored in database:', response.data);
  //   } catch (error) {
  //     console.error('Error storing Drive link in database:', error);
  //   }
  // };






  const handleGenerate = async (certificate) => {
    try {
      const response = await axios.post(`http://localhost:3000/generate-certificate`, {
        name: certificate.name,
        course: certificate.course,
        date: certificate.date,
      });

      if (response.status === 200) {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

        if (pdfBlob.size > 0) { // Ensure blob is not empty
          const url = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Certificate.pdf');
          document.body.appendChild(link);
          link.click();
          // Cleanup
          link.remove();
          window.URL.revokeObjectURL(url);

          // Upload PDF to Google Drive
          await uploadPDFToDrive(pdfBlob);

          // Store the generated Drive link in the database
          await storeDriveLinkInDB(certificate, response.data);

          // Optionally, you could also fetch updated certificate data after generating
          // the certificate if needed.
          fetchData();
        } else {
          console.error('Error: Empty PDF blob received.');
        }
      } else {
        console.error('Error: Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };
  // const handleGenerate = async (certificate) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/generate-certificate', {
  //       name: certificate.name,
  //       course: certificate.course,
  //       date: certificate.date,
  //     });

  //     if (response.status === 200) {
  //       const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

  //       if (pdfBlob.size > 0) { // Ensure blob is not empty
  //         const url = window.URL.createObjectURL(pdfBlob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', 'Certificate.pdf');
  //         document.body.appendChild(link);
  //         link.click();
  //         // Cleanup
  //         link.remove();
  //         window.URL.revokeObjectURL(url);

  //         // Upload PDF to Google Drive
  //         await uploadPDFToDrive(pdfBlob);

  //         // Store the generated Drive link in the database
  //         await storeDriveLinkInDB(certificate, response.data);

  //         // Optionally, you could also fetch updated certificate data after generating
  //         // the certificate if needed.
  //         fetchData();
  //       } else {
  //         console.error('Error: Empty PDF blob received.');
  //       }
  //     } else {
  //       console.error('Error: Unexpected response status:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error generating certificate:', error);
  //   }
  // };
  // const storeDriveLinkInDB = async (certificate, driveLink) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/store-drive-link', {
  //       certificateId: certificate._id,
  //       driveLink: driveLink,
  //     });

  //     console.log('Drive link stored in database:', response.data);
  //   } catch (error) {
  //     console.error('Error storing Drive link in database:', error);
  //   }
  // };


  // const storeDriveLinkInDB = async (certificate, pdfData) => {
  //   try {
  //     // Make a request to your backend API to store the Drive link in the database
  //     const response = await axios.post('http://localhost:3000/store-drive-link', {
  //       certificateId: certificate._id, // Assuming your certificate has an ID
  //       driveLink: 'THE_GENERATED_DRIVE_LINK', // Replace 'THE_GENERATED_DRIVE_LINK' with the actual link
  //       pdfData: pdfData, // Optionally, you can also store the PDF data if needed
  //     });

  //     console.log('Drive link stored in database:', response.data);
  //   } catch (error) {
  //     console.error('Error storing Drive link in database:', error);
  //   }
  // };


  // const handleGenerate = async (certificate) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/generate-certificate', {
  //       name: certificate.name,
  //       course: certificate.course,
  //       date: certificate.date,
  //     });



  //     console.log('Response status:', response.status);
  //     console.log('Response data:', response.data);

  //     if (response.status === 200) {
  //       const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

  //       if (pdfBlob.size > 0) { // Ensure blob is not empty
  //         const url = window.URL.createObjectURL(pdfBlob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', 'Certificate.pdf');
  //         document.body.appendChild(link);
  //         link.click();
  //         // Cleanup
  //         link.remove();
  //         window.URL.revokeObjectURL(url);
  //         // Optionally, you could also fetch updated certificate data after generating
  //         // the certificate if needed.
  //         await uploadPDFToDrive(pdfBlob);
  //         fetchData();

  //       } else {
  //         console.error('Error: Empty PDF blob received.');
  //       }
  //     } else {
  //       console.error('Error: Unexpected response status:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error generating certificate:', error);
  //   }
  // };

// Function to upload PDF to Google Drive
const uploadPDFToDrive = async (pdfBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'Certificate.pdf');

    const response = await axios.post(`http://localhost:3000/upload-to-drive`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded to Google Drive:', response.data);
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
  }
};


  return (
    <>
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-5">Certificates</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-2">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {certificates.map((certificate) => (
                  <li key={certificate._id} className="mb-3 border p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div>Name: {certificate.name}</div>
                        <div>Course: {certificate.course}</div>
                        <div>Date: {certificate.date}</div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleView(certificate)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleGenerate(certificate)}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Generate
                        </button>
                        <button
                          onClick={() => handleDelete(certificate._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">Add New Certificate</h2>
            <form onSubmit={handleSubmit} className="mb-5">
              <div className="mb-3">
                <label className="block">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border px-3 py-1 w-full"
                />
              </div>
              <div className="mb-3">
                <label className="block">Course:</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="border px-3 py-1 w-full"
                />
              </div>
              <div className="mb-3">
                <label className="block">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border px-3 py-1 w-full"
                />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>

        {selectedCertificate && (
          <div className="mt-5 border p-5">
            <h2 className="text-xl font-bold mb-3">Update Certificate</h2>
            <div className="mb-3">
              <label className="block">Name:</label>
              <input
                type="text"
                value={selectedCertificate.name}
                onChange={(e) =>
                  setSelectedCertificate({ ...selectedCertificate, name: e.target.value })
                }
                className="border px-3 py-1 w-full"
                />
            </div>
            <div className="mb-3">
              <label className="block">Course:</label>
              <input
                type="text"
                value={selectedCertificate.course}
                onChange={(e) =>
                  setSelectedCertificate({ ...selectedCertificate, course: e.target.value })
                }
                className="border px-3 py-1 w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block">Date:</label>
              <input
                type="date"
                value={selectedCertificate.date}
                onChange={(e) =>
                  setSelectedCertificate({ ...selectedCertificate, date: e.target.value })
                }
                className="border px-3 py-1 w-full"
                />
            </div>
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>

        )}
      </div>
    </>
  );
};

export default Certificate;
