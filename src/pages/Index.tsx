import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { 
  ArrowRight, 
  Sparkles, 
  Shirt, 
  Calendar,
  Lightbulb
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <motion.div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container px-3 py-6">
          <div className="max-w-sm mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 relative"
            >
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-4 p-2 rounded-full bg-primary/10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
              </motion.div>
              
              <h1 className="text-3xl font-semibold mb-4 tracking-tight leading-tight">
                Build Your Perfect
                <motion.span 
                  className="relative ml-2 inline-block"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <span className="relative z-10">Wardrobe</span>
                  <motion.span 
                    className="absolute bottom-0 left-0 right-0 h-2 bg-accent/70 -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  ></motion.span>
                </motion.span>
              </h1>
              
              <p className="text-base text-muted-foreground max-w-xs mx-auto px-2 mb-8">
                AI-powered outfit suggestions based on color, style, and fabric compatibility.
              </p>
              
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button asChild size="lg" className="w-full h-12 rounded-full">
                  <Link to="/closet">
                    <Shirt className="mr-2 h-5 w-5" />
                    My Closet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline" className="w-full h-12 rounded-full">
                  <Link to="/suggestions">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Get Suggestions
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline" className="w-full h-12 rounded-full">
                  <Link to="/today-outfit">
                    <Calendar className="mr-2 h-5 w-5" />
                    Today's Outfit
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
