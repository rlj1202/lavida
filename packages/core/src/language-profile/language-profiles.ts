import { LanguageProfile } from './language-profile.interface';

export const languageProfiles: Record<string, LanguageProfile> = {
  C99: {
    image: 'lavida-gcc',
    filename: 'main.c',
    executable: 'main',
    compile:
      'gcc -std=gnu99 -O2 -Wall -lm -static -DONLINE_JUDGE -DLAVIDA -o main main.c',
    execution: './main',
  },
  C11: {
    image: 'lavida-gcc',
    filename: 'main.c',
    executable: 'main',
    compile:
      'gcc -std=gnu11 -O2 -Wall -lm -static -DONLINE_JUDGE -DLAVIDA -o main main.c',
    execution: './main',
  },
  'C++11': {
    image: 'lavida-gcc',
    filename: 'main.cpp',
    executable: 'main',
    compile:
      // -lm: linker option for m library for math.h
      // -O2: Optimization option
      'g++ --std=gnu++11 -O2 -Wall -lm -static -DONLINE_JUDGE -DLAVIDA -o main main.cpp',
    execution: './main',
  },
  'C++14': {
    image: 'lavida-gcc',
    filename: 'main.cpp',
    executable: 'main',
    compile:
      // -lm: linker option for m library for math.h
      // -O2: Optimization option
      'g++ --std=gnu14 -O2 -Wall -lm -static -DONLINE_JUDGE -DLAVIDA -o main main.cpp',
    execution: './main',
  },
  Python2: {
    image: 'lavida-python2',
    filename: 'main.py',
    execution: 'python2 main.py',
  },
  Python3: {
    image: 'lavida-python3',
    filename: 'main.py',
    execution: 'python3 main.py',
  },
  Java8: {
    image: 'lavida-java8',
    filename: 'Main.java',
    executable: 'Main.class',
    compile:
      'javac -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java',
    execution: 'java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 Main',
  },
};
