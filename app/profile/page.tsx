"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trophy, Medal, BarChart3, MapPinned, Star, CheckCircle, ShieldCheck, ArrowLeft, LayoutDashboard, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, loading } = useAuthContext();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || !profile) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const xp = profile.xp || 0;
  const currentLevel = Math.floor(xp / 500) + 1;

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900">Profile</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-200 mb-8 relative"
      >
        <div className="absolute top-6 right-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-gray-200">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-100 pb-8 mb-8">
          <div className="h-32 w-32 rounded-full bg-gray-50 flex items-center justify-center border-4 border-primary/20 shadow-inner overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-primary" />
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {profile.name || user.displayName || "Community Hero"}
            </h1>
            <p className="text-lg text-gray-600 flex items-center justify-center md:justify-start gap-2 font-medium">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-100 text-center py-4 rounded-xl shadow-sm">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Current XP</p>
            <p className="text-3xl font-black text-blue-900 flex items-center justify-center gap-1">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> {xp}
            </p>
          </Card>
          <Card className="bg-primary border-primary text-center py-4 rounded-xl shadow-sm">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Level</p>
            <p className="text-3xl font-black text-primary">
              {currentLevel}
            </p>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100 text-center py-4 rounded-xl shadow-sm">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Reports</p>
            <p className="text-3xl font-black text-emerald-900">
              {profile.reportsSubmitted || 0}
            </p>
          </Card>
          <Card className="bg-amber-50 border-amber-100 text-center py-4 rounded-xl shadow-sm">
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">Verifications</p>
            <p className="text-3xl font-black text-amber-900 flex items-center justify-center gap-1">
              <CheckCircle className="h-6 w-6 text-green-500" /> {profile.reportsVerified || 0}
            </p>
          </Card>
        </div>
        
        {/* Badges Earned */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Badges Earned</p>
          <div className="flex items-center justify-center gap-3">
            <Medal className="h-8 w-8 text-rose-500" />
            <span className="text-4xl font-black text-gray-900">{profile.badges?.length || 0}</span>
          </div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm">
            <LayoutDashboard className="h-6 w-6" /> Go to Dashboard
          </Button>
        </Link>
        <Link href="/ranking">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <BarChart3 className="h-6 w-6" /> View Ranking
          </Button>
        </Link>
        <Link href="/awards">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm">
            <Medal className="h-6 w-6" /> View Awards
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="outline" className="w-full h-16 text-lg font-bold gap-3 border-gray-300 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all shadow-sm">
            <Trophy className="h-6 w-6" /> View Leaderboard
          </Button>
        </Link>
        <Link href="/problem-go">
          <Button className="w-full h-16 text-lg font-bold gap-3 bg-primary hover:bg-primary text-white shadow-md">
            <MapPinned className="h-6 w-6" /> Go to Problem GO
          </Button>
        </Link>
      </div>
    </div>
  );
}
