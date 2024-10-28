import { Helmet } from 'react-helmet-async';

import { CourseView } from 'src/sections/course_list/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <CourseView />
    </>
  );
}
