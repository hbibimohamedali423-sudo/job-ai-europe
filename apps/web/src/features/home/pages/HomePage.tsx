import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function HomePage() {

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 py-20 lg:py-32">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
              Find Your Perfect{' '}
              <span className="text-primary-600">Job</span>{' '}
              with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Job AI Europe is an AI-powered international job search and application platform.
              Build your profile, discover opportunities, get matched with ideal jobs,
              and create personalized applications.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              From profile to application in four simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 font-bold text-xl">
                  1
                </div>
                <CardTitle className="mt-4">Build Profile</CardTitle>
                <CardDescription>
                  Create your professional profile with skills, experience, and preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 font-bold text-xl">
                  2
                </div>
                <CardTitle className="mt-4">Discover Jobs</CardTitle>
                <CardDescription>
                  Search real jobs from multiple sources with smart filtering
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 font-bold text-xl">
                  3
                </div>
                <CardTitle className="mt-4">Get Matched</CardTitle>
                <CardDescription>
                  AI analyzes your profile against job requirements for perfect matches
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 font-bold text-xl">
                  4
                </div>
                <CardTitle className="mt-4">Apply Smart</CardTitle>
                <CardDescription>
                  Generate tailored CVs and cover letters with AI assistance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to Start Your Job Search?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of professionals who found their dream jobs with Job AI Europe
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link to="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
