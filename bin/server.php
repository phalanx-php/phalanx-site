#!/usr/bin/env php
<?php

declare(strict_types=1);

use Phalanx\Application;
use Phalanx\Stoa\PhalanxApplication;
use Phalanx\Stoa\RouteGroup;
use Phalanx\Site\Handler\HealthCheck;
use Phalanx\Site\Handler\HomePage;
use Phalanx\Site\Handler\StaticFile;
use Phalanx\Site\PhalanxSiteBundle;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return static function (array $context): PhalanxApplication {
    $app = Application::starting($context)
        ->providers(new PhalanxSiteBundle())
        ->compile();

    $routes = RouteGroup::of([
        'GET /'            => HomePage::class,
        'GET /health'      => HealthCheck::class,
        'GET /{path:.+}'   => StaticFile::class,
    ]);

    return new PhalanxApplication($app, $routes);
};
