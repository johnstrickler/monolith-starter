[#ftl]
<!DOCTYPE html>
<html>
<head>
    <title>Angular 2 QuickStart</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/styles.css">

    <!-- inject:css -->
    <!-- endinject -->

</head>
<!-- 3. Display the application -->
<body>
    <my-app>Loading...</my-app>

    <!-- inject:js -->
    <!-- endinject -->

    <!-- Polyfill(s) for older browsers -->
    <script src="vendor/core-js/client/shim.min.js"></script>
    <script src="vendor/zone.js/dist/zone.js"></script>
    <script src="vendor/reflect-metadata/Reflect.js"></script>
    <script src="vendor/systemjs/dist/system.js"></script>

    <!-- Angular App -->
    <script src="systemjs.config.js"></script>
    <script>
        System.import('app').catch(function(err){ console.error(err); });
    </script>
</body>
</html>