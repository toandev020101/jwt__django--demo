import React, { useEffect } from 'react';

const TitlePage = ({ title }) => {
  useEffect(() => {
    document.title = title;
  });
  return <></>;
};

export default TitlePage;
