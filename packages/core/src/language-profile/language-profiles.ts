import { LanguageProfile } from './language-profile.interface';

export const languageProfiles: Record<string, LanguageProfile> = {
  'C++11': {
    image: 'lavida-gcc',
    filename: 'main.cpp',
    compile:
      // -lm: linker option for m library for math.h
      // -O2: Optimization option
      'g++ --std=c++11 -O2 -Wall -lm -static -DONLINE_JUDGE -DLAVIDA -o main main.cpp',
    execution: './main',
  },
  Python3: {
    image: 'lavida-python3',
    filename: 'main.py',
    execution: 'python3 main.py',
  },
  Java8: {
    image: 'lavida-java8',
    filename: 'Main.java',
    compile:
      'javac -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java',
    execution: 'java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 Main',
  },
};
