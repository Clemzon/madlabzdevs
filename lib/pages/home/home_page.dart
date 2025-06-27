import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Optional: match your logo’s background if it isn’t fully opaque
      backgroundColor: Colors.transparent,
      body: SizedBox.expand(
        child: Image.asset(
          'assets/main_logo.png',
          fit: BoxFit.cover,   // fills entire screen, cropping if needed
        ),
      ),
    );
  }
}