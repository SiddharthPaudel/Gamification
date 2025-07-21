import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout";

import Home from "./Home/Home.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import Leaderboard from "./Leaderboard/Leaderboard.jsx";
import Puzzle from "./Puzzle/Puzzle.jsx";
import Quiz from "./Quiz/Quiz.jsx";
import Flashcard from "./FlashCard/FlashCard.jsx";
import Login from "./Login/Login.jsx";
import Signup from "./Signup/Signup.jsx";
import ModuleSection from "./Module/Module.jsx";
import Lesson from "./Lesson/Lesson.jsx";
import UserDashboard from "./UserDashboard/UserDsahboard.jsx";
import AdminDashboard from "./Admin/AdminDashboard/Dashboard.jsx";
import AddModule from "./Admin/AddModule/AddModule.jsx";
import AddFlashCard from "./Admin/AddFlashCard/AddFlashCard.jsx";
import UserTable from "./Admin/UserTable/UserTable.jsx";
import AddLesson from "./Admin/AddLesson/AddLesson.jsx";
import AddQuiz from "./Admin/AddQuiz/AddQuiz.jsx";
import WordSearchGame from "./WordSearch/WordSearchGame.jsx";
import AddDailyWordFinder from "./Admin/AddWordFInder/AddDailyWordFInder.jsx";
import QuizTable from "./Admin/QuizTable/QuizTable.jsx";
import FlashCardTable from "./Admin/FlashCardTable/FlashCardTable.jsx";
import UpdateProfile from "./Profile/UpdateProfile.jsx";
import Shop from "./Shop/Shop.jsx";
import ModuleList from "./Admin/Module/ModuleList.jsx";
// Example admin page

function App() {
  return (
    <Router>
      <Routes>
        {/* Public layout with header/footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/games/puzzle" element={<Puzzle />} />
          <Route path="/games/Word" element={<WordSearchGame/>} />
          <Route path="/games/quiz" element={<Quiz />} />
          <Route path="/games/flashcard" element={<Flashcard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/modules" element={<ModuleSection />} />
          <Route path="/lesson/:moduleId" element={<Lesson />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/shop" element={<Shop />} />
          
        </Route>

        {/* Admin layout without header/footer */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/add-module" element={<AddModule />} />
          <Route path="/admin/add-lesson" element={<AddLesson />} />
          <Route path="/admin/users" element={<UserTable />} />
          <Route path="/admin/quiz" element={<AddQuiz />} />
          <Route path="/admin/flashcard" element={<AddFlashCard />} />
          <Route path="/admin/WordFinder" element={<AddDailyWordFinder />} />
          <Route path="/admin/quiztable" element={<QuizTable/>}/> 
          <Route path="/admin/flashcardtable" element={<FlashCardTable/>}/> 
          <Route path="/admin/module-list" element={<ModuleList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
