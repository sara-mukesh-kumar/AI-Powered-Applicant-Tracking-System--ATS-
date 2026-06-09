function JobDetails() {
  const job = {
    title: 'MERN Stack Developer',
    company: 'ABC Technologies',
    location: 'Chennai',
    type: 'Full Time',
    salary: '₹6 LPA - ₹10 LPA',
    experience: '1 - 3 Years',
    match: '92% Match',
    postedDate: '2 Days Ago',
    applicants: 34,
    skills: [
      'React',
      'Node.js',
      'MongoDB',
      'Express.js',
      'JavaScript'
    ],
    description:
      'We are looking for a passionate MERN Stack Developer who can build scalable web applications and collaborate with cross-functional teams.',

    responsibilities: [
      'Develop modern web applications using React and Node.js',
      'Build REST APIs and backend services',
      'Work with MongoDB databases',
      'Collaborate with UI/UX designers',
      'Maintain code quality and performance'
    ],

    requirements: [
      'Strong knowledge of JavaScript',
      'Experience with React.js',
      'Knowledge of Node.js and Express',
      'Basic MongoDB understanding',
      'Good communication skills'
    ]
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-6 py-10 text-white">

        <div className="mx-auto max-w-7xl">

          <p className="text-sm uppercase tracking-widest text-blue-100">
            Applicant Portal
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Job Details
          </h1>

          <p className="mt-3 text-blue-100">
            Explore complete information about this opportunity.
          </p>

        </div>

      </section>

      <main className="mx-auto max-w-6xl px-5 py-8">

        {/* Main Card */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>

              <h2 className="text-3xl font-bold">
                {job.title}
              </h2>

              <p className="mt-2 text-slate-500">
                {job.company}
              </p>

            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              {job.match}
            </span>

          </div>

          {/* Info Badges */}
          <div className="mt-6 flex flex-wrap gap-3">

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              📍 {job.location}
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              💼 {job.type}
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              💰 {job.salary}
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              🧑‍💻 {job.experience}
            </span>

          </div>

        </section>

        {/* Job Stats */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Posted
            </p>

            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {job.postedDate}
            </h3>

          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Applicants
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-600">
              {job.applicants}
            </h3>

          </div>

        </section>

        {/* Description */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h3 className="mb-4 text-2xl font-bold">
            Job Description
          </h3>

          <p className="leading-7 text-slate-600">
            {job.description}
          </p>

        </section>

        {/* Responsibilities */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h3 className="mb-4 text-2xl font-bold">
            Responsibilities
          </h3>

          <ul className="space-y-3">

            {job.responsibilities.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-bold text-green-600">✓</span>
                <span>{item}</span>
              </li>
            ))}

          </ul>

        </section>

        {/* Requirements */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h3 className="mb-4 text-2xl font-bold">
            Requirements
          </h3>

          <ul className="space-y-3">

            {job.requirements.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-bold text-blue-600">•</span>
                <span>{item}</span>
              </li>
            ))}

          </ul>

        </section>

        {/* Skills */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h3 className="mb-4 text-2xl font-bold">
            Required Skills
          </h3>

          <div className="flex flex-wrap gap-3">

            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}

          </div>

        </section>

        {/* Buttons */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row">

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Apply Now
            </button>

            <button className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
              Save Job
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default JobDetails